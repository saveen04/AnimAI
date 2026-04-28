import os
import shutil
import random

# Paths
DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
ANIMALS_DIR = os.path.join(DATASET_DIR, "Animals")
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")

# Split ratio
TRAIN_SPLIT = 0.8

def prepare_dataset():
    if not os.path.exists(ANIMALS_DIR):
        print(f"Source directory {ANIMALS_DIR} not found.")
        return

    # Create train/val directories if they don't exist
    os.makedirs(TRAIN_DIR, exist_ok=True)
    os.makedirs(VAL_DIR, exist_ok=True)

    # Get class folders
    classes = [d for d in os.listdir(ANIMALS_DIR) if os.path.isdir(os.path.join(ANIMALS_DIR, d))]
    
    for cls in classes:
        src_cls_dir = os.path.join(ANIMALS_DIR, cls)
        train_cls_dir = os.path.join(TRAIN_DIR, cls)
        val_cls_dir = os.path.join(VAL_DIR, cls)
        
        os.makedirs(train_cls_dir, exist_ok=True)
        os.makedirs(val_cls_dir, exist_ok=True)
        
        # Get all images in the class folder
        images = [f for f in os.listdir(src_cls_dir) if os.path.isfile(os.path.join(src_cls_dir, f))]
        random.shuffle(images)
        
        split_idx = int(len(images) * TRAIN_SPLIT)
        train_images = images[:split_idx]
        val_images = images[split_idx:]
        
        print(f"Processing class: {cls} ({len(images)} images)")
        
        # Copy to train
        for img in train_images:
            shutil.copy2(os.path.join(src_cls_dir, img), os.path.join(train_cls_dir, img))
            
        # Copy to val
        for img in val_images:
            shutil.copy2(os.path.join(src_cls_dir, img), os.path.join(val_cls_dir, img))
            
    print("Dataset preparation complete.")

if __name__ == "__main__":
    prepare_dataset()
