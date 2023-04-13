import interpreters.interpret_elems as ielem
import interpreters.interpret_frames as iframe

import os
import re
import sys
import shutil
from pathlib import Path

program_path = Path(__file__).parent

def prompt_file(in_path, file_type):
    if file_type == 'style':
        r = re.compile('.*\.css')
    elif file_type == 'element':
        r = re.compile('.*\.yaml')
    elif file_type == 'keyframe':
        r = re.compile('.*\.frame')
    
    files = list(filter(r.match, os.listdir(in_path)))
    if len(files) <= 0:
        if (file_type == 'style'):
            return ''
        else:
            raise FileNotFoundError(f'Missing {file_type} file in {in_path}.')
    elif len(files) == 1:
        return files[0]
    else:
        file = ''
        while(file not in files):
            file = input(f'Enter the name of the {file_type} file you would like to use from {files}')
        return file

def run(in_path, out_path):
    if os.path.isdir(os.path.join(out_path, 'default')):
        shutil.rmtree(os.path.join(out_path, 'default'))
    shutil.copytree(os.path.join(program_path, 'default'), os.path.join(out_path, 'default'))
    os.remove(os.path.join(out_path, 'default', 'default.html'))

    style_file = prompt_file(in_path, 'style')
    if style_file != '':
        shutil.copy(os.path.join(in_path, style_file), os.path.join(out_path, 'user_style.css'))
    frame_file = prompt_file(in_path, 'keyframe')
    iframe.parseFrames(os.path.join(in_path, frame_file),
                       os.path.join(out_path, 'frames.js'))
    elem_file = prompt_file(in_path, 'element')
    ielem.parseFile(os.path.join(in_path, elem_file),
                    os.path.join(out_path, 'presentation.html'))

if __name__ == '__main__':
    in_path = os.getcwd()
    if len(sys.argv) > 1:
        in_path = sys.argv[1]
    out_path = os.path.join(in_path, 'presentation')
    if len(sys.argv) > 2:
        out_path = sys.argv[2]
    
    run(in_path, out_path)