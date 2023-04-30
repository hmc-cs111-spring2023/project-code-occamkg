#!/usr/bin/env python

import os
import re
import sys
import shutil
import yaml
from pathlib import Path

import interpreters.interpret_elems as ielem
import interpreters.interpret_frames as iframe

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

def render_pres(in_path, out_path):
    if os.path.isdir(os.path.join(out_path, 'default')):
        shutil.rmtree(os.path.join(out_path, 'default'))
    shutil.copytree(os.path.join(program_path, 'default'), os.path.join(out_path, 'default'))
    os.remove(os.path.join(out_path, 'default', 'default.html'))

    if os.path.isdir(os.path.join(out_path, 'assets')):
        shutil.rmtree(os.path.join(out_path, 'assets'))
    if os.path.isdir(os.path.join(in_path, 'assets')):
        shutil.copytree(os.path.join(in_path, 'assets'), os.path.join(out_path, 'assets'))

    style_file = prompt_file(in_path, 'style')
    if style_file != '':
        shutil.copy(os.path.join(in_path, style_file), os.path.join(out_path, 'user_style.css'))
    frame_file = prompt_file(in_path, 'keyframe')
    iframe.parseFrames(os.path.join(in_path, frame_file),
                       os.path.join(out_path, 'frames.js'))
    elem_file = prompt_file(in_path, 'element')
    ielem.parseFile(os.path.join(in_path, elem_file),
                    os.path.join(out_path, 'index.html'))

def setup(dir):
    if (not os.path.isdir(dir)):
        os.mkdir(dir)
    os.chdir(dir)
    f = open('elements.yaml', 'w')
    f.close()
    f = open('frames.frame', 'w')
    f.close()
    f = open('style.css', 'w')
    f.close()

    name = input('What would you like to name the project? ')

    out = input('Where would you like to output the presentation? ')

    f = open('.config', 'w')
    f.write('presentation: true\n')
    f.write(f'name: "{name}"\n')
    f.write(f'outpath: "{out}"\n')
    f.close()

if __name__ == '__main__':
    wd = os.getcwd()
    if len(sys.argv) == 2:
        if (os.path.isdir(sys.argv[1])):
            in_dir = sys.argv[1]
            config_file = os.path.join(in_dir, '.config')
            if os.path.isfile(config_file):
                file = open(config_file, 'r')
                config_data = yaml.safe_load(file)
                file.close()
                if ('presentation' in config_data and config_data['presentation']):
                    os.chdir(in_dir)
                    render_pres(in_dir, os.path.abspath(config_data['outpath']))
                    os.chdir(wd)
        elif (sys.argv[1]) == 'setup':
            setup(wd)
