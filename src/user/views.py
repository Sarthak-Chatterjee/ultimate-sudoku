from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from .forms import SignupForm, LoginForm
from .models import User


def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Successfully registered as {username}. You can now log in.')
            return redirect('login')
    else:
        form = SignupForm()
    return render(request, 'userapp/signup.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # Redirect to the home page after successful login
        else:
            error_message = 'Invalid username or password.'
    else:
        error_message = ''
    return render(request, 'userapp/login.html', {'error_message': error_message})


def logout_view(request):
    logout(request)
    return redirect('login')

def profile_view(request, *args, **kwargs):
    user = get_object_or_404(User, username=kwargs["user"])
    print(">>>", args, kwargs, type(kwargs["user"]), user)
    return render(request, 'userapp/profile.html', {"user": user})