from os import makedirs
from os.path import exists

comment = "//"
partname = "#"
interlude = "==="
interlude_empty = "..."

class Lyrics:
    url = "./sample.txt"
    entire = []
    lines = 0

    def __init__(self, url: str) -> None:
        with open(file=url, mode="r",  encoding="utf-8") as txt:
            self.entire = txt.read().split("\n")
        self.url = url
        self.lines = len(self.entire)
        print(f"[Lyrics] {url}을 불러옴")

    def readLine(self, number: int, is_strip: bool) -> str:
        if is_strip:
            return self.entire[number].strip()
        else:
            return self.entire[number]
    
    def write(self, data: list) -> None:
        with open(file=self.url, mode="w",  encoding="utf-8") as txt:
            txt.write("\n".join(data))

def writeTXT(url, content):
    with open(file=url, mode="w",  encoding="utf-8") as txt:
        txt.write(content)

def start():
    lyrics = {
        "원어": Lyrics("./원어.txt"),
        "발음": Lyrics("./발음.txt"),
        "한국어": Lyrics("./한국어.txt")
    }

    if not(lyrics["원어"].lines == lyrics["발음"].lines == lyrics["한국어"].lines):
        print("오류 :: 세 파일의 라인 수가 일치하지 않음")
        return

    result_blog = ""
    result_prompt = ""

    karaoke_pronunciation = ""  # 발음
    karaoke_interpretation = ""  # 번역

    for i in range(lyrics["원어"].lines):
        for line_number_in_block, language in enumerate(lyrics.keys(), 1):
            lyric = lyrics[language].readLine(i, True)
            # 비어있는 라인이면 또는 주석이면 패스
            if lyric == "" or lyric.startswith(comment):
                continue
            
            # {interlude}로 시작하면 간주중 표시 추가
            if lyric.startswith(interlude):
                s = [".\n", "간주중\n", ".\n\n"]
                result_blog += s[line_number_in_block-1]
                result_prompt += s[line_number_in_block-1]
                continue

            # {interlude_empty}로 시작하면 간주중 표시 추가
            if lyric.startswith(interlude_empty):
                s = [".\n", ".\n", ".\n\n"]
                result_prompt += s[line_number_in_block-1]
                continue

            # 파트 네임이면 블로그용에만 추가
            if lyric.startswith(partname):
                message = lyric.replace(partname, "").lstrip()
                s = ["\n<  ", message, "  >\n\n"]
                result_blog += s[line_number_in_block-1]
                continue
            
            # 라인에 공백이 하나도 없다면 프롬프트용에 공백 추가
            if lyric.count(" ") <= 0:
                result_blog += lyric + "\n"
                result_prompt += "ㅤ" + lyric + "ㅤ\n"
            else:
                result_blog += lyric + "\n"
                result_prompt += lyric + "\n"

            # 노래방 파일 전용
            if language == "원어":
                karaoke_interpretation += lyric + "\n"
            elif language == "발음":
                karaoke_pronunciation += lyric + "\n"
            elif language == "한국어":
                karaoke_interpretation += lyric + "\n\n"

            # 블록 중 마지막 라인이면
            if line_number_in_block == 3 and i != lyrics["원어"].lines-1:
                result_blog += "\n"
                result_prompt += "\n"


    result_folder_name = "합친거"
    if not(exists(f"./{result_folder_name}")):
        makedirs(f"./{result_folder_name}")

    karaoke_folder_name = "노래방"
    if not(exists(f"./{karaoke_folder_name}")):
        makedirs(f"./{karaoke_folder_name}")

    writeTXT(url="./합친거/블로그용.txt", content=result_blog.strip())
    writeTXT(url="./합친거/프롬프트용.txt", content=result_prompt.strip())

    writeTXT(url="./노래방/발음.txt", content=karaoke_pronunciation.strip())
    writeTXT(url="./노래방/번역.txt", content=karaoke_interpretation.strip())


start()