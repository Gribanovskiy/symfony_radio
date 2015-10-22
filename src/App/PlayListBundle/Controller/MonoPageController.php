<?php

namespace App\PlayListBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
//use App\PlayListBundle\Entity\Songs;
/**
 * MonoPage controller.
 *
 */
class MonoPageController extends Controller
{

    public function indexAction()
    {
        return $this->render('AppPlayListBundle:MonoPage:index.html.twig');
    }
}