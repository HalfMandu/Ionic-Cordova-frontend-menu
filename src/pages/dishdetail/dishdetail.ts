import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController} from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number; 
  favorite: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private favoriteservice: FavoriteProvider,
    private socialSharing: SocialSharing) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total/this.numcomments).toFixed(2);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as a favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  addComment() {
    console.log('adding comment...');
    let modal = this.modalCtrl.create(CommentPage);
    modal.present();
    modal.onDidDismiss(comment => { 
      if (comment)
        this.dish.comments.push(comment);
    });
  }

  showActions() {
    this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [{
        text: 'Add to Favorites',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
          this.addToFavorites();
        }
      },
      {
        text: 'Add Comment',
        icon: 'text',
        handler: () => {
          console.log('Add comment clicked');
          this.addComment();
        }
      },
      {
        text: 'Share via Facebook',
        handler: () => {
          this.socialSharing.shareViaFacebook(
            this.dish.name + ' -- ' + this.dish.description,
            this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to faceboook'))
            .catch(() => console.log('Failed to post to facebook'));
        }
      },
      {
        text: 'Share via Twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(
            this.dish.name + ' -- ' + this.dish.description,
            this.BaseURL + this.dish.image, '')
            .then(() => console.log('Posted successfully to twitter'))
            .catch(() => console.log('Failed to post to twitter'));
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    }).present();
  }

} 
