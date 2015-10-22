<?php

namespace App\PlayListBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

use Sonata\DoctrineORMAdminBundle\Model\ModelManager;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Exception\ModelManagerException;
use Symfony\Bridge\Doctrine\RegistryInterface;

class SongsAdmin extends Admin
{
    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
    	$file = $this->getSubject();
    	$file_inside = false;
    	if($file->getUrl() && file_exists('/var/lib/mpd/'.$file->getUrl())){
    		$file_inside = true;
    		$trackInfo = $this->parseMp3('/var/lib/mpd/'.$file->getUrl());
    	}else{
    		$trackInfo = new \stdClass();
    		$trackInfo->Title = '';
			$trackInfo->Artist = '';
			$trackInfo->Album = '';
			$trackInfo->Genre = '';
    	}
    	$directory = "/";
    	if($file->getDirectory()){
    		$directory = $file->getDirectory();
    	}
		
		$fileFieldOptions['help'] = $file->getUrl() && file_exists('/var/lib/mpd/'.$file->getUrl())?$_SERVER['DOCUMENT_ROOT'].$file->getUrl():'файл не найден';
		$fileFieldOptions['required'] = $file_inside?false:true;
        $formMapper
        	->add('file', 'file', $fileFieldOptions)
            ->add('artist', 'text', array('label' => 'Artist', 'data' => $trackInfo->Artist, 'required' => false))
			->add('title', 'text', array('label' => 'Song Title', 'data' => $trackInfo->Title, 'required' => false))
            ->add('album', 'text', array('label' => 'Album', 'data' => $trackInfo->Album, 'required' => false))
            ->add('genre', 'text', array('label' => 'Genre', 'data' => $trackInfo->Genre, 'required' => false))
            ->add('directory', 'text', array('label' => 'Directory', 'data' => $directory))
        ;
    }

    protected function parseMp3($url){
		$TextEncoding = 'UTF-8'; 

		require_once($_SERVER['DOCUMENT_ROOT'].'/libs/getid3/getid3.php'); 
		// Initialize getID3 engine 
		$getID3 = new \getID3; 

		// Analyze file and store returned data in $ThisFileInfo
		$ThisFileInfo = $getID3->analyze($url);

		$std = new \stdClass();
		$std->Title = isset($ThisFileInfo['tags']['id3v2']['title'][0])?$ThisFileInfo['tags']['id3v2']['title'][0]:'';
		$std->Artist = isset($ThisFileInfo['tags']['id3v2']['artist'][0])?$ThisFileInfo['tags']['id3v2']['artist'][0]:'';
		$std->Album = isset($ThisFileInfo['tags']['id3v2']['album'][0])?$ThisFileInfo['tags']['id3v2']['album'][0]:'';
		$std->Genre = isset($ThisFileInfo['tags']['id3v2']['genre'][0])?$ThisFileInfo['tags']['id3v2']['genre'][0]:'';
		return $std;
    }
	
    private function manageFileUpload($object) {
		$directory = $object->getDirectory();
        $directory = preg_replace("/\/$/", '', $directory);
		if(!is_dir('/var/lib/mpd/music'.$directory)){
			mkdir('/var/lib/mpd/music'.$directory, 0755);
		}
		if($object->getUrl()){
			$filename = $object->getUrl();
			$filename = explode("/",$filename);
			if(file_exists('/var/lib/mpd/'.$object->getUrl())){
				rename('/var/lib/mpd/'.$object->getUrl(),'/var/lib/mpd/music'.$directory.'/'.end($filename));
				$object->setUrl('music'.$directory.'/'.end($filename));
			}
		}
        if ($object->getFile()) {
            $object->file->move('/var/lib/mpd/music'.$directory, $object->file->getClientOriginalName());
			$object->setUrl('music'.$directory.'/'.$object->file->getClientOriginalName());
        }
		
/*
        if (null === $this->getFile()) {
            return;
        }elseif(isset($this->temp) && null === $this->getFile()){
			$this->getFile()->move('/var/lib/mpd/'.$this->temp, '/var/lib/mpd/'.$this->path);
		}

        // check if we have an old image
        if (isset($this->temp)) {
            // delete the old image
            unlink('/var/lib/mpd/'.$this->temp);
            // clear the temp image path
            $this->temp = null;
        }
        $this->file = null;
*/
		
		if ($object->getUrl()){
			if($object->getTitle() || $object->getArtist() || $object->getAlbum() || $object->getGenre()){
				$TextEncoding = 'UTF-8'; 

				require_once($_SERVER['DOCUMENT_ROOT'].'/libs/getid3/getid3.php'); 
				// Initialize getID3 engine 
				$getID3 = new \getID3; 
				$getID3->setOption(array('encoding'=>$TextEncoding)); 

				require_once($_SERVER['DOCUMENT_ROOT'].'/libs/getid3/write.php'); 
				// Initialize getID3 tag-writing module 
				$tagwriter = new \getid3_writetags; 
				//$tagwriter->filename = '/path/to/file.mp3'; 
				$tagwriter->filename = '/var/lib/mpd/'.$object->getUrl(); 

				//$tagwriter->tagformats = array('id3v1', 'id3v2.3'); 
				$tagwriter->tagformats = array('id3v2.3'); 

				// set various options (optional) 
				//$tagwriter->overwrite_tags = true; 
				//$tagwriter->overwrite_tags = false; 
				$tagwriter->tag_encoding = $TextEncoding; 
				$tagwriter->remove_other_tags = true; 	
				
				// populate data array 
				$TagData = array( 
					'title'         => array($object->getTitle()), 
					'artist'        => array($object->getArtist()), 
					'album'         => array($object->getAlbum()), 
					'genre'         => array($object->getGenre()), 
					//'popularimeter' => array('email'=>'user@example.net', 'rating'=>128, 'data'=>0), 
				); 
				$tagwriter->tag_data = $TagData; 

				// write tags 
				if (!$tagwriter->WriteTags()) { 
					die( 'Failed to write tags!<br>'.implode('<br><br>', $tagwriter->errors)); 
				} 		
			}else{
				$TextEncoding = 'UTF-8'; 

				require_once($_SERVER['DOCUMENT_ROOT'].'/libs/getid3/getid3.php'); 
				// Initialize getID3 engine 
				$getID3 = new \getID3; 
				$ThisFileInfo = $getID3->analyze('/var/lib/mpd/'.$object->getUrl());

				if(isset($ThisFileInfo['tags']['id3v2']['title'][0])){
					$object->setTitle($ThisFileInfo['tags']['id3v2']['title'][0]);
				}
				if(isset($ThisFileInfo['tags']['id3v2']['artist'][0])){
					$object->setArtist($ThisFileInfo['tags']['id3v2']['artist'][0]);
				}
				if(isset($ThisFileInfo['tags']['id3v2']['album'][0])){
					$object->setAlbum($ThisFileInfo['tags']['id3v2']['album'][0]);
				}
				if(isset($ThisFileInfo['tags']['id3v2']['genre'][0])){
					$object->setGenre($ThisFileInfo['tags']['id3v2']['genre'][0]);
				}
			}
		}
    }

	public function preRemove($object){
		if(file_exists('/var/lib/mpd/'.$object->getUrl())){
			chmod('/var/lib/mpd/'.$object->getUrl(), 0777);
			if(!unlink('/var/lib/mpd/'.$object->getUrl())){
				die('can\'t unlink');
			}
		}
	}

	public function preBatchAction($actionName, ProxyQueryInterface $query, array & $idx, $allElements){
		if($actionName == 'delete'){
	        try {
				$test = array();
	            foreach ($query->getQuery()->iterate() as $pos => $object) {
	                $url = $object[0]->getUrl();
					if(file_exists('/var/lib/mpd/'.$url) && in_array($object[0]->getId(),$idx)){
						chmod('/var/lib/mpd/'.$url, 0777);
						
						if(!unlink('/var/lib/mpd/'.$url)){
							die('can\'t unlink');
						}
					}
	            }
				
	        } catch (\PDOException $e) {
	            throw new ModelManagerException('', 0, $e);
	        }
		}
	}

	public function prePersist($object)
    {
		$this->manageFileUpload($object);
    }
	
	public function preUpdate($object)
    {
		$this->manageFileUpload($object);
    }


    // Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('artist')
			->add('title')
            ->add('album')
            ->add('genre')
            //->add('authors')
        ;
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('artist')
			->add('title')
            ->add('album')
            ->add('genre')
            ->add('url')
			//->add('authors')
        ;
    }
}