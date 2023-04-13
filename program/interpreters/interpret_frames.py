import sys
import re
from pathlib import Path
import json

path = Path(__file__).parent

def parseFrames(in_file, out_file):
    file = open(in_file, 'r')
    source = file.read()
    file.close()

    no_line_comments = re.sub(r'//.*\n', '', source)    # remove line comments
    compact = re.sub(r'\s+', ' ', no_line_comments)     # remove extra whitespace
    no_comments = re.sub(r'/\*.*\*/', '', compact)      # remove block comments

    transitions = re.split(r'-->', no_comments)[1:]
    transition_list = []
    for transition in transitions:
        transition_list.append(parseTransitionSet(transition))

    file = open(out_file, 'w')
    file.write('allFrames = ')
    file.write(json.dumps(transition_list, indent = 4))
    file.close()

def parseTransitionSet(set):
    delay = 0
    commands = []
    time_groups = re.split(' then ', set)
    for group in time_groups:
        animations = re.split(' and ', group)
        for animation in animations:
            if (len(animation.strip()) > 0):
                command = parseTransition(animation.strip())
                commands.append(command)
        # delay = newDelay

    return commands

def parseTransition(line):
    # parses 1: the target element selector (first word),
    #        2: the transition type (second word),
    #        4: transition arguments (in braces [optional]),
    #        6: a number indicating transition time in seconds
    #           (number preceded by 'for' [optional])
    #        8: a number indicating transition delay in seconds
    #           (number preceded by 'after' [optional])
    g = re.compile(r'^(.+?) (.+?)( \{(.*?)\}){0,1}( for (\d*\.{0,1}\d*)s){0,1}( after (\d*\.{0,1}\d*)s){0,1}$')
    (selector, effect, args, duration, delay) = g.search(line).group(1, 2, 4, 6, 8)
    trans_dict = {'selector': selector}

    if effect == 'show' or effect == 'hide':
        trans_dict['effect'] = 'class'
        trans_dict['value'] = 'show'
        trans_dict['add'] = effect == 'show'
    elif effect == 'addClass' or effect == 'removeClass':
        trans_dict['effect'] = 'class'
        trans_dict['value'] = args.strip()
        trans_dict['add'] = effect == 'addClass'

    elif effect == 'flyOutRight':
        trans_dict['effect'] = 'translate'
        trans_dict['value'] = ['100cqw', '0']
    elif effect == 'flyOutLeft':
        trans_dict['effect'] = 'translate'
        trans_dict['value'] = ['-100cqw', '0']
    elif effect == 'flyOutTop':
        trans_dict['effect'] = 'translate'
        trans_dict['value'] = ['0', '-100cqh']
    elif effect == 'flyOutBottom':
        trans_dict['effect'] = 'translate'
        trans_dict['value'] = ['0', '100cqh']
    elif effect == 'translate':
        trans_dict['effect'] = 'translate'
        trans_dict['value'] = args.strip().split(', ')

    elif effect == 'style':
        trans_dict['effect'] = 'style'
        trans_dict['value'] = args.strip()

    else:
        raise NotImplementedError(f'Unrecognized effect type: {effect}')
    
    return trans_dict

    # if duration != None:
    #     style += f'transition-duration: {duration}s;'
    # if delay != None:
    #     style += f'transition-delay: {delay}s;'

    # return (f'for elem in document.querySelectorAll("{selector}") {"{"}'
    #         f'elem.style.cssText = "{style}"{"}"}')