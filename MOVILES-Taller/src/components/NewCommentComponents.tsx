import React, { useState } from 'react';
import { Button, Divider, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from '../theme/appStyles';
import { Alert, View } from 'react-native';
import { push, ref, set } from 'firebase/database';
import { auth } from '../configs/firebaseConfig'; 
import { dbRealtime } from '../configs/firebaseConfig';

interface Props {
  visible: boolean;
  hideModal: () => void;
}

interface FormComment {
  comment: string;
}

export const NewCommentComponent = ({ visible, hideModal }: Props) => {
  const [formComment, setFormComment] = useState<FormComment>({
    comment: "",
  });

  const handleInputChange = (value: string) => {
    setFormComment({ comment: value });
  };

  const handleSaveComment = async () => {
    if (formComment.comment.trim() === "") {
      Alert.alert("Error", "El comentario no puede estar vacío");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "No hay usuario autenticado");
      return;
    }

    try {
      const dbRef = ref(dbRealtime, "comments");
      await set(push(dbRef), {
        email: currentUser.email,
        comment: formComment.comment.trim(),
      });

      setFormComment({ comment: "" });
      hideModal();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar el comentario");
    }
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={hideModal} 
        contentContainerStyle={[styles.modal, { maxHeight: '70%', paddingBottom: 20 }]}
      >
        <View style={styles.headerModal}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Danos tu opinión...</Text>
          <IconButton icon="close" size={24} onPress={hideModal} />
        </View>
        
        <Divider bold={true} style={{ marginBottom: 15 }} />

        <TextInput
          placeholder="Escribe tu comentario aquí..."
          mode="outlined"
          multiline
          numberOfLines={5} 
          value={formComment.comment}
          onChangeText={handleInputChange}
          style={{ minHeight: 120, textAlignVertical: 'top' }} 
        />

        <Button 
          mode="contained" 
          onPress={handleSaveComment} 
          style={{ marginTop: 20, backgroundColor: '#d32f2f' }}
          labelStyle={{ fontWeight: 'bold' }}
        >
          Publicar Comentario
        </Button>
      </Modal>
    </Portal>
  );
};