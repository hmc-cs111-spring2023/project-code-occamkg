#!/usr/bin/env python

import render_pres as render

import os
import re
import sys
import shutil
import yaml
from pathlib import Path

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
                    render.render_pres(in_dir, os.path.abspath(config_data['outpath']))
                    os.chdir(wd)
        elif (sys.argv[1]) == 'setup':
            setup(wd)
