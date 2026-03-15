# -*- coding: utf-8 -*-
import os
from odoo import http
from odoo.http import request, Response


class ZakaLanding(http.Controller):

    @http.route(
        ['/zaka', '/zaka/<path:subpath>'],
        type='http',
        auth='public',
        website=True,
        sitemap=True,
    )
    def landing(self, subpath=None, **kwargs):
        """Serve the Zaka React SPA. React Router handles client-side routing."""
        index_path = os.path.realpath(os.path.join(
            os.path.dirname(__file__),
            '..', 'static', 'dist', 'index.html'
        ))
        with open(index_path, 'r', encoding='utf-8') as f:
            html = f.read()
        return Response(html, content_type='text/html;charset=utf-8', status=200)
