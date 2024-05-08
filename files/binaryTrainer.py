import sys
import os
import configparser
import glob
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights


# Define the Dataset Class
class GarageDoorDataset(Dataset):
    def __init__(self, base_path, transform, classes):
        class0, class1 = classes
        self.transform = transform
        # Load images and labels
        self.data = []
        for label, folder in enumerate([class0, class1]):
            folder_path = os.path.join(base_path, folder)
            images = glob.glob(f'{folder_path}/*.jpg')  # Assuming images are in .jpg format
            for image in images:
                self.data.append((image, label))

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        image_path, label = self.data[idx]
        image = Image.open(image_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)

        return image, label

# Training Function
def train(model, train_loader, criterion, optimizer, device, num_epochs):
    model.train()
    for epoch in range(num_epochs):
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        print(f'Epoch {epoch+1}, Loss: {loss.item()}')

def train_main(classes, num_epochs, model_name, images_path):
    # Image Transformations
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # # Load Pre-trained MobileNetV2 and Modify It
    # model = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
    # model.classifier[1] = nn.Linear(model.last_channel, 2)  # Change for binary classification

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    # Load model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    device, transform, model = load_model(model_name)

    # Loss Function and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    # DataLoader
    dataset = GarageDoorDataset(images_path, transform, classes)
    train_loader = DataLoader(dataset, batch_size=4, shuffle=True)

    # Start Training
    train(model, train_loader, criterion, optimizer, device, num_epochs)
    
    # Save trained model and dataset
    model_path = f'./{model_name}.pth'
    torch.save(model.state_dict(), model_path)
    model.load_state_dict(torch.load(model_path))
    model.to(device)
    
    return device, transform, model

def validater(device, transform, model, val_base_path, classes):
    val_dataset = GarageDoorDataset(val_base_path, transform, classes)
    val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)
    # Evaluate the model
    return evaluate(model, val_loader, device)

# Function to evaluate the model
def evaluate(model, val_loader, device):
    model.eval()
    total = 0
    correct = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    accuracy = 100 * correct / total
    return accuracy

    
def predict(device, transform, model, image_path, classes):
    class0, class1 = classes
    model.eval()
    image = Image.open(image_path).convert('RGB')
    image = transform(image)
    image = image.unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    return class0 if predicted.item() == 1 else class1

def load_model(model_name):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    model = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
    model.classifier[1] = nn.Linear(model.last_channel, 2)
    model_path = f'./{model_name}.pth'
    model.load_state_dict(torch.load(model_path))
    model.to(device)
    
    return device, transform, model

def save_config(model_name, what, classes):
    config = configparser.ConfigParser()
    config['DEFAULT'] = {'ModelName': model_name, 'ClassifiedObject': what, 'Classes': ','.join(classes)}
    with open('config.ini', 'w') as configfile:
        config.write(configfile)

def load_config():
    config = configparser.ConfigParser()
    config.read('config.ini')
    return config['DEFAULT']

def print_usage():
    print("\nUsage: python training.py [action]\n")
    print("Actions:")
    print("  train - Train the model on a dataset of images")
    print("  validate - Test the model accuracy on a validation dataset")
    print("  predict - Classify an image based on the trained model")
    print("  help, h, -h, --help - Display this help message\n")

# Main function modified to handle command-line arguments
def main():
    if len(sys.argv) != 2:
        print_usage()
        sys.exit(1)

    action = sys.argv[1]
    if action not in ['train', 'validate', 'predict', 'help', 'h', '-h', '--help']:
        print("Invalid action.")
        print_usage()
        sys.exit(1)

    if action == 'train':
        # Request input parameters for training
        image_path = input("Enter the path to the training images: ")
        what = input("What is the object you are trying to classify? ")
        classes = input("Enter the classification names separated by a comma: ").replace(" ", "").split(',')
        model_name = input("Enter the model name to save as: ")
        num_epochs = int(input("Enter the number of epochs: "))
        save_config(model_name, what, classes)
        
        # Assume train_main function exists and handles these parameters
        train_main(classes, num_epochs, model_name, image_path)

    elif action == 'validate':
        # Request input parameters for validation
        val_path = input("Enter the path to the validation images: ")
        config = load_config()
        device, transform, model = load_model(config['ModelName'])
        classes = config['Classes'].split(',')

        accuracy = validater(device, transform, model, val_path, classes)
        print(f'The model accuracy is {accuracy}%')

    elif action == 'predict':
        # Request input parameters for prediction
        image_path = input("Enter the path to the image for prediction: ")
        config = load_config()
        device, transform, model = load_model(config['ModelName'])
        
        # Assume predict function exists and handles these parameters
        prediction = predict(device, transform, model, image_path, config['Classes'].replace(" ", "").split(','))
        print(f'The {config['ClassifiedObject']} is {prediction}.')
    
    else:
        print_usage()
        sys.exit(1)


if __name__ == '__main__':
    main()

