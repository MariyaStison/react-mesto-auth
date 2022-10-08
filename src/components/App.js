import React from 'react';
import api from '../utils/api';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import avatarPath from '../images/profile__avatar.jpg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmAvatar from './DeleteConfirmPopUp';

function App() {
  
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({ name: 'Жак-Ив Кусто', about: 'Исследователь морей', avatar: avatarPath, _id : '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmPopUpOpen, setConfirmPopUpOpen] = React.useState(false);
  const [selectedCardToDelete, setSelectedCardToDelete] = React.useState(null);
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isConfirmPopUpOpen || selectedCard ;
 
  React.useEffect(() => {
      api.getUserData()
        .then((userData) => {
          setCurrentUser(userData);
       })
       .catch((err) => {
        console.log(`Произошла ошибка при загрузки данных пользователя: ` + err);
       })},
  []);   

  React.useEffect(() => {
    api.getInitialCards()
     .then((initialCards) => {
        setCards(initialCards);
    })
    .catch((err) => {
     console.log(`Произошла ошибка при загрузки данных: ` + err);
    })},
[]);  

  function handleEditAvatarClick () {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick () {  
     setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick () {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(item) {
    setSelectedCard(item);
  }

  function closeAllPopups () {
    isEditAvatarPopupOpen && setIsEditAvatarPopupOpen(false);
    isEditProfilePopupOpen && setIsEditProfilePopupOpen(false);
    isAddPlacePopupOpen && setIsAddPlacePopupOpen(false);
    isConfirmPopUpOpen && setConfirmPopUpOpen(false);
    (selectedCard != null) && setSelectedCard(null);  
    (selectedCardToDelete != null) && setSelectedCardToDelete(null);  
  }

  React.useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])
  
  function handleUpdateUser ({name, about}) {
    setIsLoading(true);
    api.patchUserData({
      name,
      about})
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Произошла ошибка при сохранении данных пользователя: ` + err);
       })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleUpdateAvatar (link){
    setIsLoading(true);
    api.patchAvatar(link)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Произошла ошибка при сохранении аватара пользователя: ` + err);
       })
      .finally(() => {
        setIsLoading(false);;
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
      .catch((err) => {
        console.log(`Произошла ошибка при изменении статуса лайка: ` + err);
      })
  }

  function handleCardDelete(card) {
    setConfirmPopUpOpen(true);
    setSelectedCardToDelete(card);
 }

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api.postNewCard({
      name: newCard.name,
      link: newCard.link
    })
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Произошла ошибка при добавлении карточки: ` + err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleComfirmDelete() {
    setIsLoading(true);
    api.deleteCard(selectedCardToDelete._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== selectedCardToDelete._id));
      closeAllPopups();
    })
    .catch((err) => {
      console.log(`Произошла ошибка при удалении карточки: ` + err);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main 
          onEditProfile = {handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete} />
        <Footer /> 
        
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}/> 

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}/>
        
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}/> 

        <DeleteConfirmAvatar
          card={selectedCardToDelete}
          isOpen={isConfirmPopUpOpen}
          onClose={closeAllPopups}
          onConfirm={handleComfirmDelete}
          isLoading={isLoading}/>
       
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>    
  );
}

export default App;
