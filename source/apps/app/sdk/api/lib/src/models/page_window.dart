import 'package:json_annotation/json_annotation.dart';

part 'page_window.g.dart';

/// Page Window
@JsonSerializable(includeIfNull: false)
class PageWindow {
  const PageWindow({
    this.limit,
    this.offset,
  });
  final int? limit;
  final int? offset;

  factory PageWindow.fromJson(Map<String, dynamic> json) => _$PageWindowFromJson(json);

  Map<String, dynamic> toJson() => _$PageWindowToJson(this);
}