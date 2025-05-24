class CountButton extends ButtonWidget {
  constructor(id, parentElement, palette) {
    super(id, parentElement, 'Count: 0', palette);
    this.setState({ count: 0 });
  }

  handleClick() {
    const c = this.state.get().count;
    this.setState({ count: c + 1, label: `Count: ${c + 1}` });
  }
}
