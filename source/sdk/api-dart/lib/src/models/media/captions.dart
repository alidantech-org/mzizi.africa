import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/media/text_origin.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'captions.g.dart';

/// Title, description and alt text of an asset in one language.
@JsonSerializable(includeIfNull: false)
class MediaCaptions {
  const MediaCaptions({
    this.altText,
    required this.assetId,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.languageId,
    required this.origin,
    this.title,
    required this.updatedAt,
    required this.version,
  });
  final String? altText;
  final String assetId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String languageId;
  final MediaTextOrigin origin;
  final String? title;
  final DateTime updatedAt;
  final int version;

  factory MediaCaptions.fromJson(Map<String, dynamic> json) => _$MediaCaptionsFromJson(json);

  Map<String, dynamic> toJson() => _$MediaCaptionsToJson(this);
}
