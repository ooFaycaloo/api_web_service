import mongoose from 'mongoose';
import Album from '../models/Album.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.Album = connect.model('Album', Album);
    this.run();
  }

  create() {
    this.app.post('/album', (req, res) => {
      const album = new this.Album(req.body);
      return album.save()
        .then((savedAlbum) => res.status(201).json(savedAlbum))
        .catch((err) => res.status(400).json({ code: 400, message: err.message }));
    });
  }

  getAll() {
    this.app.get('/albums', (req, res) => {
      const filter = req.query.title ? { title: new RegExp(req.query.title, 'i') } : {};
      return this.Album.find(filter)
        .populate('photos')
        .then((albums) => res.status(200).json(albums))
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  showById() {
    this.app.get('/album/:id', (req, res) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ code: 400, message: 'Invalid Album ID format' });
      }

      console.log(`Recherche de l'album avec ID : ${id}`);

      return this.Album.findById(id)
        .populate('photos')
        .then((foundAlbum) => {
          if (!foundAlbum) {
            return res.status(404).json({ code: 404, message: 'Album not found' });
          }
          return res.status(200).json(foundAlbum);
        })
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  updateById() {
    this.app.put('/album/:id', (req, res) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ code: 400, message: 'Invalid Album ID format' });
      }

      return this.Album.findByIdAndUpdate(id, req.body, { new: true })
        .then((updatedAlbum) => {
          if (!updatedAlbum) {
            return res.status(404).json({ code: 404, message: 'Album not found' });
          }
          return res.status(200).json(updatedAlbum);
        })
        .catch((err) => res.status(400).json({ code: 400, message: err.message }));
    });
  }

  deleteById() {
    this.app.delete('/album/:id', (req, res) => {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ code: 400, message: 'Invalid Album ID format' });
      }

      return this.Album.findByIdAndDelete(id)
        .then((deletedAlbum) => {
          if (!deletedAlbum) {
            return res.status(404).json({ code: 404, message: 'Album not found' });
          }
          return res.status(200).json({ message: 'Album deleted successfully' });
        })
        .catch((err) => res.status(500).json({ code: 500, message: err.message }));
    });
  }

  run() {
    this.create();
    this.getAll();
    this.showById();
    this.updateById();
    this.deleteById();
  }
};

export default Albums;
