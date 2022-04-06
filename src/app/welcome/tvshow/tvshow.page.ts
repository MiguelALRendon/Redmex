import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceService } from '../service.service';
import { TvModalPagePage } from '../tv-modal-page/tv-modal-page.page';

@Component({
  selector: 'app-tvshow',
  templateUrl: './tvshow.page.html',
  styleUrls: ['./tvshow.page.scss'],
})
export class TvshowPage implements OnInit {

  imageURL : string = 'http://image.tmdb.org/t/p/original/'

  bannerOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay:true
  }

  movieOpts = {
    slidesPerView: 1.6,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  extraOpts = {
    slidesPerView: 2.7,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  extraOpts2 = {
    slidesPerView: 1.9,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  BannerVar: any = []
  EmitionVar : any = []
  PopularVar : any = []
  AirVar : any = []
  TopVar : any = []

  constructor(private modalCtrl : ModalController, private service : ServiceService) { }

  ngOnInit() {
    this.InitializeBanner()
    this.InitializeInEmition()
    this.InitializePopular()
    this.InitializeToday()
    this.InitializeTop()
  }

  //Inicializa el Banner con los datos de series estrenadas ese día (Poster)
  InitializeBanner(){
    this.service.getAiringToday().subscribe(air =>{
      air.results.slice(13).forEach(air =>{
        this.BannerVar.push({
          id: air.id,
          poster: this.imageURL + air.poster_path
        })
      })
    })
  }

  //Inicializa con series en emisión (Imagen)
  InitializeInEmition(){
    this.service.getInEmition().subscribe(emit =>{
      emit.results.forEach(emit =>{
        if(emit.backdrop_path != null){
          this.EmitionVar.push({
            id: emit.id,
            image: this.imageURL + emit.backdrop_path
          })
        }
      })
    })
  }

  //Inicializa con series populares (Poster)
  InitializePopular(){
    this.service.getPopular('tv').subscribe(pop =>{
      pop.results.forEach(pop =>{
        this.PopularVar.push({
          id: pop.id,
          poster: this.imageURL + pop.poster_path
        })
      })
    })
  }

  //Inicializa el "Estrenos: Hoy" (Poster)
  InitializeToday(){
    this.service.getAiringToday().subscribe(air=>{
      air.results.forEach(air=>{
        if(air.poster_path != null){
          this.AirVar.push({
            id: air.id,
            poster: this.imageURL + air.poster_path
          })
        }
      })
    })
  }

  //Obtiene los mejores lanzamientos de la historia(imagen)
  InitializeTop(){
    this.service.getTopRated('tv').subscribe(top =>{
      top.results.forEach(top =>{
        if(top.backdrop_path != null){
          this.TopVar.push({
            id: top.id,
            image: this.imageURL + top.backdrop_path
          })
        }
      })
    })
  }

  async openTv(id){
    const modal = await this.modalCtrl.create({
      component: TvModalPagePage,
      componentProps: {reqId: id},
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.3, 0.6, 1],
      cssClass: 'tv-modal-page'
    })

    return await modal.present()
  }
}
