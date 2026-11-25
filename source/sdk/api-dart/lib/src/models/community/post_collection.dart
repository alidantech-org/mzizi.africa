import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/post_entry.dart';

part 'post_collection.g.dart';

/// Post Collection
@JsonSerializable(includeIfNull: false)
class CommunityPostCollection {
  const CommunityPostCollection({required this.posts});
  final List<CommunityPostEntry> posts;

  factory CommunityPostCollection.fromJson(Map<String, dynamic> json) => _$CommunityPostCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityPostCollectionToJson(this);
}
