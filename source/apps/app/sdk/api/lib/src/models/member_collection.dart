import 'package:json_annotation/json_annotation.dart';
import 'member_entry.dart';

part 'member_collection.g.dart';

/// Member Collection
@JsonSerializable(includeIfNull: false)
class MemberCollection {
  const MemberCollection({
    required this.values,
  });
  final List<MemberEntry> values;

  factory MemberCollection.fromJson(Map<String, dynamic> json) => _$MemberCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$MemberCollectionToJson(this);
}