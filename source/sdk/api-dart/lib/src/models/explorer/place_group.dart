import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'place_group.g.dart';

/// Place Group
@JsonSerializable(includeIfNull: false)
class ExplorerPlaceGroup {
  const ExplorerPlaceGroup({required this.children, required this.place, required this.total});
  final List<ExplorerPlace> children;
  final ExplorerPlace place;
  final int total;

  factory ExplorerPlaceGroup.fromJson(Map<String, dynamic> json) => _$ExplorerPlaceGroupFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerPlaceGroupToJson(this);
}
