import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_child.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'place_browse.g.dart';

/// Place Browse
@JsonSerializable(includeIfNull: false)
class InsightsPlaceBrowse {
  const InsightsPlaceBrowse({required this.chain, required this.children, required this.media, this.place});
  final List<InsightsPlaceCrumb> chain;
  final List<InsightsPlaceChild> children;
  final List<Object?> media;
  final InsightsPlaceCrumb? place;

  factory InsightsPlaceBrowse.fromJson(Map<String, dynamic> json) => _$InsightsPlaceBrowseFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceBrowseToJson(this);
}
