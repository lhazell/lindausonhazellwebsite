from django.conf.urls import patterns, url
from main import views
from django.contrib.sitemaps import Sitemap
from django.contrib.sites.models import Site
from django.views.generic import TemplateView


class SitesSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7
    location = "/"

    def items(self):
        return Site.objects.all()


sitemaps = {'main': SitesSitemap}

urlpatterns = patterns('',
        url(r'^$', views.index, name='main-index',),
        url(r'^index\.html$', views.index, name='main-index',),
        url(r'^cis/pml-test\.pml$', TemplateView.as_view(template_name='main/pml-test.pml'), name="cis_test"),
        (r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),
    )