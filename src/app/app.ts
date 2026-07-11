/**
 * Root Angular component for the Wordix web client.
 * Provides the top-level router outlet while route trees own their feature and shell composition.
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'wx-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
