import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/build/image-gallery.css';
import getSlug from 'speakingurl';
import Scroll from 'react-scroll';
import {pathFor} from '/lib/utils';

class Help extends React.Component {
  scrollToTop(event) {
    event.preventDefault();
    Scroll.animateScroll.scrollToTop();
  }

  renderItem(item) {
    return (
      <div className="step block">
        <img
          src={item.original}
          alt={item.originalAlt}
        />
        {
          item.description &&
            <p className="instructions">
              {item.description}
            </p>
        }
      </div>
    );
  }

  render() {
    const items = [
      {
        header: 'Creating a new variable',
        images: [
          {
            original: '/images/help/add-variable01.png',
            thumbnail: '/images/help/add-variable01.png',
            description: 'Add a variable by pressing the blue button in the right bottom corner.',
          },
          {
            original: '/images/help/add-variable02.png',
            thumbnail: '/images/help/add-variable02.png',
            description: 'You can now enter a name for the new variable '
              + 'and confirm with the enter key.',
          },
        ],
      },
      {
        header: 'Creating a new link',
        images: [
          {
            original: '/images/help/add-link01.png',
            thumbnail: '/images/help/add-link01.png',
            description: 'Hover over the outline of a variable. '
              + 'When the cursor changes into a crosshair, you can '
              + 'click and hold to drag out a new link.',
          },
          {
            original: '/images/help/add-link02.png',
            thumbnail: '/images/help/add-link02.png',
            description: 'You can now drag the link and release the '
              + 'mouse button over the variable you want to connect.',
          },
          {
            original: '/images/help/add-link03.png',
            thumbnail: '/images/help/add-link03.png',
            description: 'Change the link polarity by clicking the plus or minus symbol.',
          },
          {
            original: '/images/help/add-link04.png',
            thumbnail: '/images/help/add-link04.png',
            description: 'Drag the control point to give your link some flow. '
              + 'Once it looks awesome you can go ahead and create another one!',
          },
        ],
      },
    ];

    const {model} = this.props;

    return (
      <div className="help-text">
        <div className="text-wrap wide">
          {model &&
            <a
              className="close-window"
              title="Back to model"
              href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}
            >
              <i className="material-icons">close</i>
            </a>
          }

          <h1><i className="material-icons left">help</i>Help</h1>
          <ol className="toc">
            {items.map((item, i) => (
              <li key={i}>
                <Scroll.Link
                  to={getSlug(item.header)} href={`#${getSlug(item.header)}`}
                  smooth duration={500}
                  offset={-75}
                >
                  {item.header}
                </Scroll.Link>
              </li>
            ))}
          </ol>
          <ol className="items">
            {items.map((item, i) => (
              <section key={i} className="item">
                <li>
                  <a name={getSlug(item.header)} id={getSlug(item.header)}>{item.header}</a>
                </li>
                <ImageGallery
                  items={item.images}
                  renderItem={this.renderItem}
                  disableArrowKeys
                  showIndex
                />
              </section>
            ))}
          </ol>

          <a
            href="#top"
            onClick={this.scrollToTop}
            title="Scroll to top"
            className="scroll-to-top"
          >
            <i className="material-icons">keyboard_arrow_up</i>
          </a>
        </div>
      </div>
    );
  }
}

Help.propTypes = {
  model: React.PropTypes.object,
};

export default Help;
