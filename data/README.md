This folder contains raw and processed datasets.
# Data Folder

## Purpose

This folder contains all datasets used in the Fake News Detection project. The data is used for preprocessing, data cleaning, model training, and evaluation.

## Files

### True.csv

Contains real news articles collected from reliable news sources. These records are labeled as Real News (Label = 1).

### Fake.csv

Contains fake news articles collected from various sources. These records are labeled as Fake News (Label = 0).

### cleaned_dataset.csv

This file is generated after data cleaning and preprocessing. Duplicate records are removed and the data is prepared for machine learning model training.

## Usage

1. True.csv and Fake.csv are loaded using Pandas.
2. Both datasets are merged into a single dataset.
3. Labels are assigned to identify real and fake news.
4. Data cleaning is performed to remove inconsistencies and duplicate records.
5. The cleaned dataset is used for training and testing the Fake News Detection model.

## Tools Used

* Python
* Pandas
* NumPy
* Jupyter Notebook
