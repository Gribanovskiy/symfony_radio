<?php

namespace App\PlayListBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use App\PlayListBundle\Entity\Songs;
use App\PlayListBundle\Form\SongsType;

/**
 * Songs controller.
 *
 */
class SongsController extends Controller
{

    /**
     * Lists all Songs entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('AppPlayListBundle:Songs')->findAll();

        return $this->render('AppPlayListBundle:Songs:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Songs entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new Songs();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
			
            $entity->file->move(__DIR__.'/../../../../web/music', $entity->file->getClientOriginalName());
            $entity->setUrl('music/'.$entity->file->getClientOriginalName());
			
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('app_songs_show', array('id' => $entity->getId())));
        }

        return $this->render('AppPlayListBundle:Songs:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Creates a form to create a Songs entity.
     *
     * @param Songs $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Songs $entity)
    {
        $form = $this->createForm(new SongsType(), $entity, array(
            'action' => $this->generateUrl('app_songs_create'),
            'method' => 'POST',
        ));
		
        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Songs entity.
     *
     */
    public function newAction()
    {
        $entity = new Songs();
        $form   = $this->createCreateForm($entity);

		
        return $this->render('AppPlayListBundle:Songs:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
		
    }

    /**
     * Finds and displays a Songs entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppPlayListBundle:Songs')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Songs entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('AppPlayListBundle:Songs:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing Songs entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppPlayListBundle:Songs')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Songs entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('AppPlayListBundle:Songs:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Songs entity.
    *
    * @param Songs $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Songs $entity)
    {
        $form = $this->createForm(new SongsType(), $entity, array(
            'action' => $this->generateUrl('app_songs_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Songs entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('AppPlayListBundle:Songs')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Songs entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('app_songs_edit', array('id' => $id)));
        }

        return $this->render('AppPlayListBundle:Songs:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Songs entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('AppPlayListBundle:Songs')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Songs entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('app_songs'));
    }

    /**
     * Creates a form to delete a Songs entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('app_songs_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
