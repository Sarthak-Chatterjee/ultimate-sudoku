from django import forms
from .models import Sudoku

class SudokuForm(forms.ModelForm):
    block_rows = forms.IntegerField(min_value=1, label='Block Rows')
    total_size = forms.IntegerField(min_value=1, label='Total Size')

    class Meta:
        model = Sudoku
        fields = ['total_size', 'block_rows', 'problem', 'solution']

    def clean(self):
        cleaned_data = super().clean()
        total_size = cleaned_data.get('total_size')
        block_rows = cleaned_data.get('block_rows')

        if total_size and block_rows:
            if total_size % block_rows != 0:
                raise forms.ValidationError('Total size must be divisible by block rows.')
            else:
                # change block_cols to right value for showing
                pass

        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        block_rows = self.cleaned_data.get('block_rows')
        total_size = self.cleaned_data.get('total_size')

        if block_rows and total_size:
            instance.block_columns = total_size // block_rows

        # use input values for problem and solution:
        
        

        if commit:
            instance.save()
        return instance
