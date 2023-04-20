import os
import sys
import yaml # pip install pyyaml
from lxml import etree as t # pip install lxml
import cssselect # pip install cssselect
from pathlib import Path
from copy import deepcopy

path = Path(__file__).parent

def parseFile(in_file, out_file):
    file = open(in_file, 'r')
    content = yaml.safe_load(file)
    file.close()

    elements = {}
    keep = set() # elements to render alone even if they are used as a child of another element
    for name in content:
        if name in elements:
            raise Warning(f'{name} was already defined in this file.')
        else:
            if ('render' in content[name] and content[name]['render']):
                keep.add(name)
            elements[name] = parseElem(content[name], name)

    # move 'elements' (with possible REFERENCE elements)
    # to 'complete elements' (with REFERENCEs replaced by element copies)
    complete_elements = {}
    used_elements = set()
    updating = True
    while (len(elements) > 0 and updating):
        updating = False
        updated_keys = []
        for elem in elements:
            ref_elems = elements[elem].cssselect('div.REFERENCE')
            if len(ref_elems) == 0:
                complete_elements[elem] = elements[elem]
                updated_keys.append(elem)
                updating = True
            else:
                for ref_e in ref_elems:
                    ref_name = ref_e.attrib['id']
                    if ref_name in complete_elements:
                        ref_e.getparent().replace(ref_e, deepcopy(complete_elements[ref_name]))
                        used_elements.add(ref_name)
                        updating = True
        for key in updated_keys:
            elements.pop(key)
    
    # remove elements that were copied as children unless keep specified
    for elem_name in used_elements:
        if elem_name not in keep:
            complete_elements.pop(elem_name)

    doc = t.parse(os.path.join(path.parent, 'default', 'default.html'), t.XMLParser(remove_blank_text = True))
    canvas = doc.getroot().cssselect('#canvas')[0]
    i = 0
    for elem in complete_elements:
        if ('class' in complete_elements[elem].attrib and 'full' in complete_elements[elem].attrib['class']):
            full_pane = complete_elements[elem]
        else:
            full_pane = t.Element('div')
            full_pane.attrib['class'] = 'full content'
            full_pane.append(complete_elements[elem])
        canvas.insert(i, full_pane)
        i += 1

    doc.getroot().cssselect('#canvas')[0].getparent().replace(doc.getroot().cssselect('#canvas')[0], canvas)

    config = open(os.path.join(Path(in_file).parent, '.config'))
    config_data = yaml.safe_load(config)
    config.close()

    if ('name' in config_data):
        doc.getroot().cssselect('title')[0].text = config_data['name']

    file = open(out_file, 'w')
    file.write(t.tostring(doc, pretty_print = True, encoding = 'unicode'))
    file.close()


def parseElem(raw_elem, id):
    e = None

    if 'text' in raw_elem:
        e = t.Element('p')
        e.text = raw_elem['text']

    elif 'img' in raw_elem:
        e = t.Element('img')
        e.attrib['src'] = raw_elem['img']

    elif 'item' in raw_elem:
        e = t.Element('li')
        e.text = raw_elem['item']

    elif 'ul' in raw_elem:
        e = t.Element('ul')
        for item in raw_elem['ul']:
            item_id = list(item.keys())[0]
            e.append(parseElem(item[item_id], item_id))

    elif 'ol' in raw_elem:
        e = t.Element('ol')
        for item in raw_elem['ol']:
            item_id = list(item.keys())[0]
            e.append(parseElem(item[item_id], item_id))

    elif 'content' in raw_elem:
        e = t.Element('div')
        for elem in raw_elem['content']:
            if type(elem) == str:
                child = t.Element('div')
                child.attrib['id'] = elem
                child.attrib['class'] = 'REFERENCE'
                e.append(child)
            else:
                elem_id = list(elem.keys())[0]
                e.append(parseElem(elem[elem_id], elem_id))

    else:
        raise NotImplementedError('Unrecognized element type')



    if (id != '_'):
        e.attrib['id'] = id
    class_list = ''
    if 'class' in raw_elem:
        class_list += raw_elem['class']

    if 'align' in raw_elem:
        if raw_elem['align'] == 'center-xy':
            class_list += ' center-x center-y'
        else:
            class_list += f' {raw_elem["align"]}'

    if 'size' in raw_elem:
        class_list += f' {raw_elem["size"]}'

    if class_list != '':
        e.attrib['class'] = class_list
    
    style = ''
    if 'style' in raw_elem:
        style += raw_elem['style']
    e.attrib['style'] = style
    
    return e