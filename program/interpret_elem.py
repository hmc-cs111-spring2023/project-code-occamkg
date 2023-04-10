import sys
import yaml # pip install pyyaml
from lxml import etree as t # pip install lxml
import cssselect # pip install cssselect
from pathlib import Path
from copy import deepcopy

path = Path(__file__).parent

def parseFile(fname):
    with open(fname, 'r') as file:
        content = yaml.safe_load(file)

        elements = {}
        for name in content:
            if name in elements:
                raise Warning(name + " was already defined in this file.")
            else:
                elements[name] = parseElem(content[name], name)

        complete_elements = {}
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
                            updating = True
            for key in updated_keys:
                elements.pop(key)

        doc = t.parse('default.html')
        canvas = doc.getroot().cssselect('#canvas')[0]
        for elem in complete_elements:
            full_pane = t.Element('div')
            full_pane.attrib['class'] = 'full content'
            full_pane.append(complete_elements[elem])
            canvas.append(full_pane)

        doc.getroot().cssselect('#canvas')[0].getparent().replace(doc.getroot().cssselect('#canvas')[0], canvas)

        file = open(path / 'output/output.html', 'w')
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



    e.attrib['id'] = id
    class_list = ''
    if 'class' in raw_elem:
        class_list += raw_elem['class']

    if 'align' in raw_elem:
        if raw_elem['align'] == 'center-xy':
            class_list += " center-x center-y"
        else:
            class_list += " " + raw_elem['align']

    if 'size' in raw_elem:
        class_list += " " + raw_elem['size']

    e.attrib['class'] = class_list
    
    style = ''
    if 'style' in raw_elem:
        style += raw_elem['style']
    e.attrib['style'] = style
    
    return e

if __name__ == "__main__":
    parseFile(sys.argv[1])