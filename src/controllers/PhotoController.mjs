import PhotoModel from '../models/photo.mjs';
import AlbumModel from '../models/album.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.run();
  }

  create() {
    this.app.post('/album/:idalbum/photo', async (req, res) => {
      const photo = new this.PhotoModel({
        ...req.body,
        album: req.params.idalbum
      });

      photo.save()
        .then(async (savedPhoto) => {
          await this.AlbumModel.findByIdAndUpdate(
            req.params.idalbum,
            { $push: { photos: savedPhoto._id } }
          );
          return res.status(201).json(savedPhoto);
        })
        .catch((err) => res.status(400).json({ code: 400, message: err.message }));
    });
  }

  getAllFromAlbum() {
    this.app.get('/album/:idalbum/photos', (req, res) => {
      this.PhotoModel.find({ album: req.params.idalbum })
        .populate('album')
        .then((photos) => res.status(200).json(photos))
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  getByIdFromAlbum() {
    this.app.get('/album/:idalbum/photo/:idphotos', (req, res) => {
      this.PhotoModel.findOne({ _id: req.params.idphotos, album: req.params.idalbum })
        .populate('album')
        .then((foundPhoto) => {
          if (!foundPhoto) {
            return res.status(404).json({ code: 404, message: 'Photo not found' });
          }
          return res.status(200).json(foundPhoto);
        })
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  updateById() {
    this.app.put('/album/:idalbum/photo/:idphotos', (req, res) => {
      this.PhotoModel.findByIdAndUpdate(req.params.idphotos, req.body, { new: true })
        .then((updatedPhoto) => {
          if (!updatedPhoto) {
            return res.status(404).json({ code: 404, message: 'Photo not found' });
          }
          return res.status(200).json(updatedPhoto);
        })
        .catch((err) => res.status(400).json({ code: 400, message: err.message }));
    });
  }

  deleteById() {
    this.app.delete('/album/:idalbum/photo/:idphotos', async (req, res) => {
      this.PhotoModel.findByIdAndDelete(req.params.idphotos)
        .then(async (deletedPhoto) => {
          if (!deletedPhoto) {
            return res.status(404).json({ code: 404, message: 'Photo not found' });
          }
          await this.AlbumModel.findByIdAndUpdate(
            req.params.idalbum,
            { $pull: { photos: deletedPhoto._id } }
          );
          return res.status(200).json({ message: 'Photo deleted' });
        })
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  run() {
    this.create();
    this.getAllFromAlbum();
    this.getByIdFromAlbum();
    this.updateById();
    this.deleteById();
  }
};

export default Photos;
