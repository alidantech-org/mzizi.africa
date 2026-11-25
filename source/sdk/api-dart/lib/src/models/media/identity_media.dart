import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'identity_media.g.dart';

/// Identity Media
@JsonSerializable(includeIfNull: false)
class MediaIdentityMedia {
  const MediaIdentityMedia({required this.identityId, this.limit, this.offset});
  final String identityId;
  final int? limit;
  final int? offset;

  factory MediaIdentityMedia.fromJson(Map<String, dynamic> json) => _$MediaIdentityMediaFromJson(json);

  Map<String, dynamic> toJson() => _$MediaIdentityMediaToJson(this);
}
