import { Component, OnInit, Input} from '@angular/core';
import html2canvas from 'html2canvas';
import pdf from 'jspdf'

@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss']
})

export class PrintPreviewComponent implements OnInit {

  @Input() targetHtml:string = 'xxx';
  @Input() title:string = 'chart';
  @Input() className: string = 'print-icon';

  constructor() { }

  ngOnInit() {

  }

  generateImage = (type = 'img') => {
    const html: any = document.getElementById(this.targetHtml);
    const icons: any = html.querySelector('.print-icon');
    const header: any = html.querySelector('.header-title');
    let text = '';
    if(icons){
      // icons.style.opacity = 0;
      icons.style.display = 'none';
    }
    if(header){
      text = header.innerHTML;
      header.innerHTML = `NTU ${text}`
    }
    
    html2canvas(html,{removeContainer: true}).then((canvas) =>{
      const dataUrl = canvas.toDataURL("image/jpeg");
      const day = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const hour = new Date().getHours();
      const minut = new Date().getMinutes();
      const second = new Date().getSeconds();
      const datePick = `-${year}${month}${day}-${hour}${minut}${second}`;
      const blob = canvas.toBlob((blobs) =>{
        if(type =='pdf'){
          const {width, height } = canvas;
          let pos: any = 'p';
          if(width > height){
            pos = 'l';
          }
          const doc: any = new pdf(pos, 'px', [canvas.width, canvas.height]);
          doc.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
          doc.save(this.title + datePick);   
          
        }else{
          const url = URL.createObjectURL(blobs);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.title + datePick;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        if(icons){
          // icons.style.opacity = 1;
          icons.style.display = '';
        }
        if(header){
          header.innerHTML = text;
        }
      });
    });

  }

}
