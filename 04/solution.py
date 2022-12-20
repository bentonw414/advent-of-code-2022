def isContained(line: str) -> bool:
    left_range, right_range = line.split(",")
    low_left, high_left = map(lambda x: int(x), left_range.split("-"))
    low_right, high_right = map(lambda x: int(x), right_range.split("-"))

    if low_left <= low_right and high_right <= high_left:
        return True
    if low_right <= low_left and high_left <= high_right:
        return True
    return False

def solution1():
    with open("./input.txt", "r") as f:
        return sum(map(lambda x : 1 if isContained(x) else 0, f.read().split("\n")))


def hasOverlap(line: str) -> bool:
    left_range, right_range = line.split(",")
    low_left, high_left = map(lambda x: int(x), left_range.split("-"))
    low_right, high_right = map(lambda x: int(x), right_range.split("-"))
    
    if high_left < low_right:
        return False
    if high_right < low_left:
        return False
    return True


def solution2():
    with open("./input.txt", "r") as f:
        return sum(map(lambda x : 1 if hasOverlap(x) else 0, f.read().split("\n")))

print(solution1())
print(solution2())