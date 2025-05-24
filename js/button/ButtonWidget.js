class ButtonWidget extends StatefulWidget {
  constructor(id, parentElement, label = 'Click Me', palette = null) {
    super(id, parentElement);
    this.palette = palette;
    this.setState({ label });

    this.onStateChange(this.render);
    this.styleElement({}, this.palette); // Use base class sugar

    this.root.addEventListener('click', () => this.handleClick());
  }

  handleClick() {
    this.setState({ label: 'Clicked!' });
  }

  render(state = this.state.get()) {
    this.setHTML(`<button>${state.label}</button>`);
  }
}

  
