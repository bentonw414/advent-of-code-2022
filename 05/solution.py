import json 
def solution1():
    with open("./input.txt", "r") as f:
        stack_number_to_stack = {

        }
        stack_number = 1
        while(True):
            next_chunk = f.read(3)
            if stack_number not in stack_number_to_stack:
                stack_number_to_stack[stack_number] = []

            if next_chunk != "   ":
                if (next_chunk[1].isdigit()):
                    while("\n" != f.read(1)):
                        pass
                    f.read(1) # empty line
                    break
                stack_number_to_stack[stack_number].append(next_chunk[1])
            space = f.read(1)
            if space == "\n":
                stack_number = 1
            else:
                stack_number += 1

        current_line = f.readline()
        while current_line:
            _, quantity, _, from_stack_number, _, to_stack_number = current_line.split(" ")
            quantity = int(quantity)
            from_stack_number = int(from_stack_number)
            to_stack_number = int(to_stack_number)

            from_stack = stack_number_to_stack[from_stack_number]
            to_stack = stack_number_to_stack[to_stack_number]


            for i in range(quantity):
                to_stack.insert(0, from_stack.pop(0))
            current_line = f.readline()

        
        output = ""
        for i in range(len(stack_number_to_stack)):
            output += stack_number_to_stack[i+1][0]

        return output


def solution2():
    with open("./input.txt", "r") as f:
        stack_number_to_stack = {

        }
        stack_number = 1
        while(True):
            next_chunk = f.read(3)
            if stack_number not in stack_number_to_stack:
                stack_number_to_stack[stack_number] = []

            if next_chunk != "   ":
                if (next_chunk[1].isdigit()):
                    while("\n" != f.read(1)):
                        pass
                    f.read(1) # empty line
                    break
                stack_number_to_stack[stack_number].append(next_chunk[1])
            space = f.read(1)
            if space == "\n":
                stack_number = 1
            else:
                stack_number += 1

        current_line = f.readline()
        while current_line:
            # print(stack_number_to_stack)
            _, quantity, _, from_stack_number, _, to_stack_number = current_line.split(" ")
            quantity = int(quantity)
            from_stack_number = int(from_stack_number)
            to_stack_number = int(to_stack_number)

            from_stack = stack_number_to_stack[from_stack_number]
            to_stack = stack_number_to_stack[to_stack_number]
            # print(from_stack, to_stack)

            to_stack = from_stack[:quantity].copy() + to_stack
            from_stack = from_stack[quantity:]

            stack_number_to_stack[from_stack_number] = from_stack
            stack_number_to_stack[to_stack_number] = to_stack

            
            # print(from_stack, to_stack, quantity)
            current_line = f.readline()

        
        output = ""
        for i in range(len(stack_number_to_stack)):
            output += stack_number_to_stack[i+1][0]

        return output

        

        
print(solution1())
print(solution2())