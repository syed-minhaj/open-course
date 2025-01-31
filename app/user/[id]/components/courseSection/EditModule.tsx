
import { useEffect, useRef, useState } from "react";
import ImageInput from "./ImageInput";
import { CheckCheck , Pencil ,MoveVertical} from "lucide-react";
import { module_created as module } from "@/app/types";
import { Reorder , useDragControls } from "framer-motion";

const EditModule = ({moduleEdited , module , index} : {moduleEdited: (modules: module) => void, module : module, index : number}) => { 
    const [image, setImage] = useState<File | null>(module.modelImage);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [name, setName] = useState<string>(module.modelName);
    const [link, setLink] = useState<string>(module.materialLink);
    const [isEditting, setIsEditting] = useState<boolean>(false);
    const controls = useDragControls();
  
    useEffect(() => {
      if (image) {
        const url = URL.createObjectURL(image);
        setImageUrl(url);
        return () => {URL.revokeObjectURL(url);};
      } else {
        setImageUrl('');
      }
    }, [image]);
  
    useEffect(() => {
      setImage(module.modelImage);
      setName(module.modelName);
      setLink(module.materialLink);
    }, [module]);
  
    function save() {
      const updatedModule = {
        indexInCourse: index,
        modelName: name,
        materialLink: link,
        modelImage: image
      };
      moduleEdited(updatedModule);
      setIsEditting(false);
    }
    const elementRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (event: React.PointerEvent | React.TouchEvent): void => {
      event.preventDefault();
      
      if ('touches' in event) {
        const touch = event.touches[0];
        // Create a synthetic pointer event
        const pointerEvent = new PointerEvent('pointerdown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          pointerId: 1,
          pointerType: 'touch',
          bubbles: true
        });
        
        if (elementRef.current) {
          elementRef.current.dispatchEvent(pointerEvent);
        }
      } else {
        controls.start(event);
      }
    };

    

    return (
      <Reorder.Item
        key={module.modelName} 
        value={module}
        className="w-full"
        dragListener={false} dragControls={controls}
      >
        {!isEditting ? (
          <div className="w-full flex flex-row gap-1 bg-opacity-25 bg-white rounded flex-wrap 
              dark:bg-opacity-15 dark:bg-black p-2 border dark:border-black border-white">
            <div ref={elementRef} className="h-fit w-fit reorder-handle cursor-move touch-none my-auto "
              onPointerDown={(e) => controls.start(e)}
              onTouchStart={handleDragStart}
            >
              <MoveVertical className="w-6 h-6  opacity-30 "/>
            </div>
            <h1 className="text-primary p-2 m-auto">{index + 1}</h1>
            {imageUrl && (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-24 h-16 object-cover rounded-lg"
                />
            )}
            <h1 className="text-primary text-lg p-2 my-auto flex-1 min-w-fit">{name}</h1>
            <h2 className="text-primary text-sm p-2 my-auto flex-1 min-w-fit opacity-45 ">{link}</h2>
            <button 
              onClick={() => setIsEditting(true)}
              className="p-1 px-2 rounded bg-secondary text-prePrimary mx-auto py-auto "
            >
              <Pencil className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-row gap-1 bg-opacity-25  bg-white dark:bg-black dark:bg-opacity-15 
                rounded flex-wrap p-2 border border-white dark:border-black ">
            <ImageInput onImageChange={setImage} simple  defaultImage={imageUrl}/>
            <input className="p-2 rounded border-2 dark:border-black bg-opacity-25 bg-white flex-1
                dark:bg-opacity-25 dark:bg-black placeholder-gray-800"
              placeholder="Module Name" type="text" required onChange={(e) => setName(e.target.value)} value={name}
            />
            <input className="p-2 rounded border-2 dark:border-black bg-opacity-25 bg-white flex-1
                dark:bg-opacity-25 dark:bg-black placeholder-gray-800"
              placeholder="Content url" type="text"required onChange={(e) => setLink(e.target.value)} value={link}
            />
            <button
              onClick={() => {
                save();
              }}
              className="p-1 px-2 rounded bg-secondary text-prePrimary"
            >
              <CheckCheck className="w-6 h-6" />
            </button>
          </div>
        )}
      </Reorder.Item>
    );
};

export default EditModule;