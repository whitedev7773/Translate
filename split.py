from os.path import exists

file_name = input("분리할 파일 입력\n>> ")

if file_name == "":
    file_name = "./합친거/프롬프트용.txt"
else:
    file_name = f"./합친거/{file_name}.txt"

if not(exists(file_name)):
    print("파일이 없습니다.")
    exit()

"""
どこから春が 巡り来るのか
도코카라 하루가 메구리쿠루노카
어디서 봄이 돌아오는걸까

知らず 知らず 大人になった
시라즈 시라즈 오토나니 낫타
모르게 모르게 어른이 되었네

見上げた先には 燕が飛んでいた
미아게타 사키니와 츠바메가 톤데이타
기운없이 쳐다본 하늘에선
"""

# 위처럼 저장된 파일을 각 3줄씩 분리해서 저장
# 한국어.txt, 발음.txt, 원어.txt로 저장

with open(file_name, "r", encoding="utf-8") as f:
    lines = f.readlines()

# 파일이 이미 존재하면 덮어쓰기
open("./원어.txt", "w", encoding="utf-8").close()
open("./발음.txt", "w", encoding="utf-8").close()
open("./한국어.txt", "w", encoding="utf-8").close()

def appendPartName(f, part_name: str):
    part_name = part_name.replace("<", "").replace(">", "").strip()
    part_name = f"# {part_name}"
    f.write(part_name + "\n")

for i in range(0, len(lines), 4):
    print(f"처리중: {i + 1}/{len(lines)}")
    with open(f"./원어.txt", "a", encoding="utf-8") as f:
        f.write(lines[i])
    with open(f"./발음.txt", "a", encoding="utf-8") as f:
        f.write(lines[i + 1])
    with open(f"./한국어.txt", "a", encoding="utf-8") as f:
        f.write(lines[i + 2])

print("분리 완료")