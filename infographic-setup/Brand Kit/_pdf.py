from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
import os

W,H=A4
M=34
c=canvas.Canvas("Shettys-Desk-Brand-Kit.pdf", pagesize=A4)

INK=HexColor("#15315C"); MUT=HexColor("#5D7599"); LINE=HexColor("#DCEAF8")
AZ=HexColor("#2798FB"); DEEP=HexColor("#215DC3"); NAVY=HexColor("#1939A5")

def rrect(x,y,w,h,r,fill=None,stroke=None,sw=1):
    if fill is not None: c.setFillColor(fill)
    if stroke is not None: c.setStrokeColor(stroke); c.setLineWidth(sw)
    c.roundRect(x,y,w,h,r,stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)

def grad_rrect(x,y,w,h,r,stops):
    c.saveState()
    p=c.beginPath(); 
    # rounded rect path
    p.roundRect(x,y,w,h,r); c.clipPath(p,stroke=0,fill=0)
    cols=[HexColor(s) for s in stops]
    c.linearGradient(x,y+h,x+w,y,cols, extend=True)
    c.restoreState()

# ---------- Header band ----------
hb=120
grad_rrect(M,H-M-hb,W-2*M,hb,16,["#50A9F7","#215DC3","#1939A5"])
# eco accent dot
c.saveState()
p=c.beginPath(); p.circle(W-M-46, H-M-46, 26); c.clipPath(p,stroke=0,fill=0)
c.linearGradient(W-M-72,H-M-72,W-M-20,H-M-20,[HexColor("#8FF3CC"),HexColor("#38E6A6"),HexColor("#2798FB")],extend=True)
c.restoreState()
c.setFillColor(white)
c.setFont("Helvetica",22); c.drawString(M+22,H-M-46,"Shetty's Desk")
c.setFont("Helvetica-Bold",30); c.drawString(M+22,H-M-80,"BRAND KIT")
c.setFont("Helvetica",10.5); c.setFillColor(HexColor("#D6E8FB"))
c.drawString(M+22,H-M-100,"Infographic visual system  ·  isometric 2.5D vector  ·  pure white canvas")

y=H-M-hb-26

# ---------- Section helper ----------
def head(label,yy):
    c.setFillColor(AZ); c.setFont("Helvetica-Bold",11)
    c.drawString(M,yy,label.upper())
    c.setStrokeColor(LINE); c.setLineWidth(1.4); c.line(M+ c.stringWidth(label.upper(),"Helvetica-Bold",11)+10, yy+3, W-M, yy+3)
    return yy-16

# ---------- Colors ----------
y=head("Color palette",y)
def swatch(x,yy,w,h,hexv,name,role,darktext=False):
    rrect(x,yy-h,w,h,7,fill=HexColor(hexv))
    rrect(x,yy-h,w,h,7,stroke=LINE,sw=.8)
    c.setFillColor(INK if darktext else white)
    c.setFont("Helvetica-Bold",8.2); c.drawString(x+7,yy-15,name)
    c.setFont("Helvetica",7.2); c.drawString(x+7,yy-h+7,hexv)
cols=[("#2798FB","Azure",0),("#50A9F7","Sky",0),("#247BE1","Royal",0),("#215DC3","Deep",0),("#1939A5","Navy",0),
      ("#38E6A6","Eco Green",0),("#8FF3CC","Mint",1),("#E27199","Coral",0)]
sw=(W-2*M-7*6)/8
for i,(hx,nm,dk) in enumerate(cols):
    swatch(M+i*(sw+6),y,sw,40,hx,nm,"",dk)
c.setFont("Helvetica",7.5); c.setFillColor(MUT)
c.drawString(M,y-52,"Semantics:  BLUE = system / neutral    GREEN = positive / progress / the smart choice    CORAL = negative / warning (sparingly)")
# tints + neutrals row
y2=y-66
tn=[("#E2F0FB","T100",1),("#C5E2F8","T200",1),("#A6D1F8","T300",1),("#7CBAF6","T400",1),
    ("#15315C","Ink",0),("#5D7599","Muted",0),("#DCEAF8","Line",1),("#FFFFFF","White",1)]
for i,(hx,nm,dk) in enumerate(tn):
    swatch(M+i*(sw+6),y2,sw,30,hx,nm,"",dk)
y=y2-30-18

# ---------- Gradients ----------
y=head("Signature gradients",y)
gw=(W-2*M-2*10)/3
grads=[("Blue",["#50A9F7","#215DC3","#1939A5"],"infrastructure · scenes"),
       ("Eco  (signature)",["#8FF3CC","#38E6A6","#2798FB"],"the positive element"),
       ("Tint wash",["#E2F0FB","#A6D1F8"],"backgrounds · cards")]
gh=46
for i,(nm,st,use) in enumerate(grads):
    gx=M+i*(gw+10)
    grad_rrect(gx,y-gh,gw,gh,8,st)
    c.setFillColor(white); c.setFont("Helvetica-Bold",8.5); c.drawString(gx+8,y-16,nm)
    c.setFillColor(MUT); c.setFont("Helvetica",7.2); c.drawString(gx,y-gh-10,use)
y=y-gh-24

# ---------- Two columns: Typography + Illustration ----------
colY=y
colW=(W-2*M-20)/2
# Typography (left)
yy=head("Typography  —  Poppins (geometric sans)",colY)
def line(txt,yy,fnt="Helvetica",sz=8.5,col=MUT,x=M):
    c.setFillColor(col); c.setFont(fnt,sz); c.drawString(x,yy,txt); return yy-12.5
yy=line("Section header   Helvetica/Poppins 800 · UPPERCASE",yy,"Helvetica-Bold",9,INK)
yy=line("Item label   Poppins 700 · Title Case",yy,"Helvetica-Bold",8.5,INK)
yy=line("Body   Poppins 300-400 · muted blue · short & scannable",yy)
c.setFillColor(HexColor("#38E6A6")); c.setFont("Helvetica-Bold",22); c.drawString(M,yy-12,"97%")
c.setFillColor(DEEP); c.setFont("Helvetica",8); c.drawString(M+58,yy-6,"OF THE TIME")
c.setFillColor(MUT); c.setFont("Helvetica",7.2); c.drawString(M,yy-26,"Signature move: huge bold number + light caption")
# Illustration (right)
rx=M+colW+20
yy2=colY
c.setFillColor(AZ); c.setFont("Helvetica-Bold",11); c.drawString(rx,yy2,"ILLUSTRATION STYLE")
c.setStrokeColor(LINE); c.setLineWidth(1.4); c.line(rx+150,yy2+3,W-M,yy2+3)
yy2-=15
for t in ["Flat isometric / 2.5D vector, smooth gradients","Soft long shadows · pure white background",
          "Green gradient = the positive element only","Mini-figures + green speech bubbles = human touch"]:
    c.setFillColor(HexColor("#38E6A6")); c.setFont("Helvetica-Bold",8.5); c.drawString(rx,yy2,"+")
    c.setFillColor(MUT); c.setFont("Helvetica",8); c.drawString(rx+12,yy2,t); yy2-=12.5
for t in ["No photoreal / 3D · no hard outlines","No dark or busy backgrounds · no clutter"]:
    c.setFillColor(HexColor("#E27199")); c.setFont("Helvetica-Bold",8.5); c.drawString(rx,yy2,"x")
    c.setFillColor(MUT); c.setFont("Helvetica",8); c.drawString(rx+12,yy2,t); yy2-=12.5
y=min(yy-30,yy2)-6

# ---------- Reference thumbnails ----------
y=head("Logo (terracotta #D97656 / olive #3C3828)  +  style references",y)
imgs=["logos/1.png","reference-images/icon-set_perks.png",
      "reference-images/isometric_cutaway.png","reference-images/icon-row_concepts.png","reference-images/isometric_city_scene.png"]
iw=(W-2*M-4*8)/5; ih=78
for i,im in enumerate(imgs):
    ix=M+i*(iw+8)
    try:
        img=ImageReader(im); iwd,ihd=img.getSize(); ar=ihd/iwd
        dh=min(ih, iw*ar); 
        if 'logos/' in im:
            rrect(ix,y-ih,iw,ih,6,fill=HexColor("#0B0B0B"))
        rrect(ix,y-ih,iw,ih,6,stroke=LINE,sw=.8)
        c.drawImage(img,ix+2,y-ih+2,iw-4,ih-4,preserveAspectRatio=True,anchor='n',mask='auto')
    except Exception as e:
        print("img err",e)
y=y-ih-18

# ---------- Master style block ----------
y=head("Master style block  (paste into Gemini / ChatGPT Image)",y)
block=('Flat-design isometric 2.5D vector infographic illustration in the "Shetty\'s Desk" brand '
'style. Smooth blue gradients (azure #2798FB -> royal #247BE1 -> deep navy #1939A5), rounded geometric '
'shapes, soft diffused long shadows, subtle glows, clean editorial composition on a pure white '
'background. A signature green eco-gradient (mint #8FF3CC -> emerald #38E6A6) marks the positive / '
'progress / highlighted element; coral-pink #E27199 marks any negative element, sparingly. Modern, '
'optimistic, tech-forward. NOT photorealistic, no 3D render, no hard black outlines, no sketch texture, '
'no dark backgrounds.')
bh=70
rrect(M,y-bh,W-2*M,bh,8,fill=HexColor("#0F1F3A"))
c.setFillColor(HexColor("#DBE8FB")); c.setFont("Helvetica",7.4)
# wrap
import textwrap
lines=textwrap.wrap(block, 132)
ty=y-12
for ln in lines[:7]:
    c.drawString(M+10,ty,ln); ty-=9.3
y=y-bh-14
c.setFillColor(MUT); c.setFont("Helvetica-Oblique",7.5)
c.drawString(M,y,"Full pack: STYLE-GUIDE.md  ·  brand-tokens.json  ·  PROMPT-LIBRARY.txt  ·  interactive .html  ·  /reference-images  ·  /logos")

c.showPage(); c.save()
print("PDF done")
