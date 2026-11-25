import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'release_window.g.dart';

/// Release Window
@JsonSerializable(includeIfNull: false)
class ProductReleaseWindow {
  const ProductReleaseWindow({this.limit, this.offset});
  final int? limit;
  final int? offset;

  factory ProductReleaseWindow.fromJson(Map<String, dynamic> json) => _$ProductReleaseWindowFromJson(json);

  Map<String, dynamic> toJson() => _$ProductReleaseWindowToJson(this);
}
