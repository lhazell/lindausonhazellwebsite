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

#def contactview(request):
#        subject = request.POST.get('topic', '')
#        message = request.POST.get('message', '')
#        from_email = request.POST.get('email', '')
#
#        if subject and message and from_email:
#                try:
#                    send_mail(subject, message, from_email, ['change@this.com'])
#                except BadHeaderError:
#                        return HttpResponse('Invalid header found.')
#                return HttpResponseRedirect('/contact/thankyou/')
#        else:
#            return render_to_response('contacts.html', {'form': ContactForm()})
#    
#        return render_to_response('contacts.html', {'form': ContactForm()},
#            RequestContext(request))
#
#def thankyou(request):
#        return render_to_response('thankyou.html')
