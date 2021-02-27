import logging
from django.http import HttpResponse
from django.shortcuts import render, redirect
from google.appengine.api import mail

def index(request):
    if request.method == 'POST':
        logging.debug('Arrived at Post')
        
        name =  request.POST.get('name', '')
        email = request.POST.get('email', '')
        message = request.POST.get('message', '')

        #if form.is_valid():
        if email and message:
            try:
                mail.send_mail(sender='' + name + '<' + email + '>',
                              to="Lindauson Hazell <contact@lindauson.com>",
                              subject="New e-mail from lindauson.com",
                              body=message)
                return redirect('/')
            except:
                return HttpResponse('Invalid header found.')
    else:
        context = {}
        return render(request, 'main/index.html', context)
