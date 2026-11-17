import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/member_entry.dart';

part 'member_collection.g.dart';

/// Member Collection
@JsonSerializable(includeIfNull: false)
class ReferenceMemberCollection {
  const ReferenceMemberCollection({required this.values});
  final List<ReferenceMemberEntry> values;

  factory ReferenceMemberCollection.fromJson(Map<String, dynamic> json) => _$ReferenceMemberCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceMemberCollectionToJson(this);
}
