from django import template

register = template.Library()


@register.simple_tag
def get_val(mat, row, col=None):
    try:
        if col is None: val = mat[row]
        else: val = mat[row][col]
        return val if str(val) != "0" else ""
    except IndexError or KeyError:
        return None