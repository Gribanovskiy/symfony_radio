<?php

namespace App\PlayListBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
/**
 * MonoPage controller.
 *
 */
class CanvasController extends Controller
{

    public function indexAction()
    {
        return $this->render('AppPlayListBundle:Canvas:index.html.twig');
    }
}