# -*- coding: utf-8 -*-
import os
from odoo import http
from odoo.http import request, Response


class ZakaLanding(http.Controller):

    @http.route(
        ['/', '/<path:subpath>'],
        type='http',
        auth='public',
        website=True,
        sitemap=False,
    )
    def landing(self, subpath=None, **kwargs):
        """
        Serve the Zaka React SPA for all routes.
        React Router handles client-side navigation internally.
        """
        # Read the built index.html from static/dist
        index_path = os.path.join(
            os.path.dirname(__file__),
            '..', 'static', 'dist', 'index.html'
        )
        with open(os.path.realpath(index_path), 'r', encoding='utf-8') as f:
            html = f.read()

        return Response(html, content_type='text/html;charset=utf-8', status=200)
