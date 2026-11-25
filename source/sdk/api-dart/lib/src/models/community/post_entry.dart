import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/post_state.dart';

part 'post_entry.g.dart';

/// Post Entry
@JsonSerializable(includeIfNull: false)
class CommunityPostEntry {
  const CommunityPostEntry({
    this.body,
    this.displayName,
    this.handle,
    required this.kindTerm,
    this.languageCode,
    required this.postId,
    this.publishedAt,
    this.rating,
    required this.state,
  });
  final String? body;
  final String? displayName;
  final String? handle;
  final String kindTerm;
  final String? languageCode;
  final String postId;
  final DateTime? publishedAt;
  final int? rating;
  final CommunityPostState state;

  factory CommunityPostEntry.fromJson(Map<String, dynamic> json) => _$CommunityPostEntryFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityPostEntryToJson(this);
}
