def letter_to_priority(c: str) -> int:
    if c.capitalize() == c:
        return ord(c) - 65 + 27
    else:
        return ord(c) - 97 + 1

def getSingleLinePriority(line: str) -> int:
    first_half = line[:len(line)// 2]
    second_half = line[len(line)// 2:]

    for c in first_half:
        if c in second_half:
            # print(c, letter_to_priority(c))
            return letter_to_priority(c)


def solution1():
    with open("./input.txt", "r") as f:
        return sum(map(getSingleLinePriority, f.read().split("\n")))

def getGroupPriority(line1, line2, line3) -> int:
    for c in line1:
        if c in line2 and c in line3:
            return letter_to_priority(c)

def solution2():
    with open("./input.txt", "r") as f:
        total = 0
        all_lines = f.read().split("\n")

        for i, line in enumerate(all_lines):
            if i % 3 == 2:
                total += getGroupPriority(all_lines[i], all_lines[i-1], all_lines[i-2])

        return total



print(solution1())
print(solution2())