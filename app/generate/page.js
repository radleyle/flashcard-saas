"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  CardActionArea,
  AppBar,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import FlipIcon from '@mui/icons-material/Flip';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, collection, getDoc, writeBatch, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '@clerk/nextjs';

// Helper function to ensure user document exists
const createUserDocument = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, { flashcardSets: [] });
  }
};

// Flashcard component
const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <CardActionArea onClick={handleFlip}>
        <CardContent>
          <Typography variant="h6">{isFlipped ? 'Answer:' : 'Question:'}</Typography>
          <Typography>{isFlipped ? back : front}</Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={handleFlip}
      >
       
      </IconButton>
    </Card>
  );
};

// FlashcardSet component
const FlashcardSet = ({ set, onClick, onDelete }) => {
  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardActionArea onClick={() => onClick(set)}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {set.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(set);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default function Generate() {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedFlashcardsSets, setSavedFlashcardsSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);

  // Open and close dialog handlers
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  // Save flashcards function
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    if (!user) {
      alert('Please Log in to Save Cards');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert('User document not found.');
        return;
      }

      const userData = userDocSnap.data();
      const existingSets = userData.flashcardSets || [];

      // Check for duplicate set names
      const isDuplicate = existingSets.some(set => set.name === setName);
      if (isDuplicate) {
        alert('A flashcard set with this name already exists. Please choose a different name.');
        return;
      }

      const batch = writeBatch(db);

      // Update user's flashcardSets
      const updatedSets = [...existingSets, { name: setName }];
      batch.update(userDocRef, { flashcardSets: updatedSets });

      // Save flashcards
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName('');
      fetchSavedFlashcards(); // Refresh saved flashcards list
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert(`An error occurred while saving flashcards: ${error.message}`);
    }
  };

  // Handle flashcard generation
  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert(`An error occurred while generating flashcards: ${error.message}`);
    }
  };

  // Fetch saved flashcard sets
  const fetchSavedFlashcards = useCallback(async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const sets = userData.flashcardSets || [];
        const setsWithFlashcards = await Promise.all(
          sets.map(async (set) => {
            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), set.name);
            const setDocSnap = await getDoc(setDocRef);
            return {
              name: set.name,
              flashcards: setDocSnap.exists() ? setDocSnap.data().flashcards : []
            };
          })
        );
        setSavedFlashcardsSets(setsWithFlashcards);
      }
    } catch (error) {
      console.error('Error fetching saved flashcards:', error);
    }
  }, [user]);

  // Handle delete flashcard set
  const handleDeleteSet = async (setToDelete) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.id);
      const batch = writeBatch(db);

      // Remove set from user's flashcardSets
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = (userData.flashcardSets || []).filter(set => set.name !== setToDelete.name);
        batch.update(userDocRef, { flashcardSets: updatedSets });
      }

      // Delete the flashcard set document
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setToDelete.name);
      batch.delete(setDocRef);

      await batch.commit();

      alert('Flashcard set deleted successfully!');
      fetchSavedFlashcards(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      alert(`An error occurred while deleting the flashcard set: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user) {
      createUserDocument(user.id);
      fetchSavedFlashcards();
    }
  }, [user, fetchSavedFlashcards]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ backgroundColor: 'white', padding: 2, mt: '10vh' }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Generated Flashcards
              </Typography>
              <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Flashcard front={flashcard.front} back={flashcard.back} />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                  Save Flashcards
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Display Saved Flashcards Sets */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Saved Flashcard Sets
            </Typography>
            {savedFlashcardsSets.length === 0 ? (
              <Typography>No saved flashcard sets found.</Typography>
            ) : (
              savedFlashcardsSets.map((set, index) => (
                <FlashcardSet
                  key={index}
                  set={set}
                  onClick={(selectedSet) => setSelectedSet(selectedSet)}
                  onDelete={handleDeleteSet}
                />
              ))
            )}
          </Box>

          {/* Display Flashcards of Selected Set */}
          {selectedSet && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Flashcards in {selectedSet.name}
              </Typography>
              {selectedSet.flashcards.length > 0 ? (
                <Grid container spacing={2}>
                  {selectedSet.flashcards.map((flashcard, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Flashcard front={flashcard.front} back={flashcard.back} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No flashcards in this set.</Typography>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSelectedSet(null)}
                sx={{ mt: 2 }}
              >
                Back to All Sets
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
