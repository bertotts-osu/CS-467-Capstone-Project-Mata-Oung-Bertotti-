# test_runner.py
# Provides utilities to run user-submitted Python code against generated test cases in a secure, isolated environment.

import tempfile
import subprocess
import os


def indent_code(code_string, spaces=4):
    """
    Indent each non-empty line in code_string by the given number of spaces.
    :param code_string: The code to indent
    :param spaces: Number of spaces to indent
    :return: Indented code string
    """
    indentation = ' ' * spaces
    return "\n".join(indentation + line if line.strip() != "" else line for line in code_string.splitlines())


def run_test_cases_against_solution(code: str, test_cases: list) -> list:
    """
    Runs a Python implementation against generated test cases.
    Mutates each test case in-place to include 'user_output' and 'result'.

    This version supports two modes:
      1. Single-line test input: evaluates the expression (e.g. "[1, 2, 5], 11")
         and passes its unpacked values to main.
      2. Multi-line test input: executes assignment code (e.g. "coins = [1, 2, 5]\ntarget = 11")
         and then uses inspect to build the call to main. In this example, if main expects
         'arr' but only 'coins' is defined, we make that mapping.
    :param code: User's Python code as a string
    :param test_cases: List of test case dictionaries with 'input' and 'expected_output'
    :return: List of test case dictionaries with added 'user_output', 'error', and 'result'
    """
    print(test_cases)
    for test_case in test_cases:
        test_input = test_case['input'].strip()
        expected_output = str(test_case['expected_output'])

        if "\n" in test_input:
            # Multi-line test input: use exec to set up variables.
            # Build a code block that:
            #   1. Executes the test_input, storing results in __test_vars.
            #   2. Inspects main's parameter names.
            #   3. Tries to fetch each parameter from __test_vars.
            #       (As an example, if main expects 'arr' but __test_vars lacks it,
            #        check for 'coins'.)
            #   4. Calls main with the assembled arguments.
            test_code = (
                    code.strip() + "\n\n" +
                    "if __name__ == '__main__':\n"
                    "    __test_vars = {}\n"
                    "    exec(\"\"\"" + test_input + "\"\"\", __test_vars)\n"
                                                     "    import inspect\n"
                                                     "    __args_names = inspect.getfullargspec(main).args\n"
                                                     "    __args = []\n"
                                                     "    for name in __args_names:\n"
                                                     "        if name in __test_vars:\n"
                                                     "            __args.append(__test_vars[name])\n"
                                                     "        elif name == 'arr' and 'coins' in __test_vars:\n"
                                                     "            __args.append(__test_vars['coins'])\n"
                                                     "        else:\n"
                                                     "            raise Exception(f'Missing parameter: {name}')\n"
                                                     "    result = main(*__args)\n"
                                                     "    print(result)\n"
            )
        else:
            # Single-line test input: evaluate it as a tuple expression.
            test_code = (
                    code.strip() + "\n\n" +
                    "if __name__ == '__main__':\n"
                    "    args = eval(\"" + test_input + "\")\n"
                                                        "    result = main(*args)\n"
                                                        "    print(result)\n"
            )

        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp:
                temp.write(test_code)
                temp_filename = temp.name

            proc = subprocess.run(
                ['python', temp_filename],
                capture_output=True,
                timeout=5
            )
            actual_output = proc.stdout.decode().strip()
            error_output = proc.stderr.decode().strip()

            passed = (actual_output == expected_output) and (proc.returncode == 0)
            test_case["user_output"] = actual_output
            test_case["error"] = error_output if not passed else None
            test_case["result"] = "passed" if passed else "failed"
        except subprocess.TimeoutExpired:
            test_case["user_output"] = ""
            test_case["error"] = "Execution timed out."
            test_case["result"] = "failed"
        except Exception as e:
            test_case["user_output"] = ""
            test_case["error"] = str(e)
            test_case["result"] = "failed"
        finally:
            os.remove(temp_filename)

    return test_cases
