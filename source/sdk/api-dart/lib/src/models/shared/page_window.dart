import 'package:json_annotation/json_annotation.dart';

part 'page_window.g.dart';

/// Page Window
@JsonSerializable(includeIfNull: false)
class SharedPageWindow {
  const SharedPageWindow({this.limit, this.offset});
  final int? limit;
  final int? offset;

  factory SharedPageWindow.fromJson(Map<String, dynamic> json) => _$SharedPageWindowFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPageWindowToJson(this);
}
