<?php

namespace App\PlayListBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
/**
 * MonoPage controller.
 *
 */
class GameController extends Controller
{

    public function indexAction()
    {
        return $this->render('AppPlayListBundle:Game:index.html.twig');
    }
}